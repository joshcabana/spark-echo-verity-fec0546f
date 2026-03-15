import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { ANALYTICS_EVENTS, getVariant, trackEvent } from "@/lib/analytics"

export function useExperiment(
  experimentKey: string,
  variants: string[],
): string | null {
  const { user } = useAuth()
  const [variant, setVariant] = useState<string | null>(null)
  const exposureKeyRef = useRef<string | null>(null)
  const variantsKey = variants.join("|")

  useEffect(() => {
    if (!user?.id || variants.length === 0) {
      setVariant(null)
      return
    }

    let isActive = true

    const assignVariant = async () => {
      const { data: existingAssignment, error: selectError } = await supabase
        .from("experiment_assignments")
        .select("variant_key")
        .eq("user_id", user.id)
        .eq("experiment_key", experimentKey)
        .maybeSingle()

      if (selectError) {
        console.error("Failed to read experiment assignment", selectError)
        return
      }

      const assignedVariant =
        existingAssignment?.variant_key ??
        getVariant(user.id, experimentKey, variants)

      if (!existingAssignment?.variant_key) {
        const { error: upsertError } = await supabase
          .from("experiment_assignments")
          .upsert(
            {
              user_id: user.id,
              experiment_key: experimentKey,
              variant_key: assignedVariant,
            },
            { onConflict: "user_id,experiment_key" },
          )

        if (upsertError) {
          console.error("Failed to persist experiment assignment", upsertError)
          return
        }
      }

      if (!isActive) {
        return
      }

      setVariant(assignedVariant)

      const exposureKey = `${user.id}:${experimentKey}:${assignedVariant}`
      if (exposureKeyRef.current === exposureKey) {
        return
      }

      exposureKeyRef.current = exposureKey
      trackEvent(ANALYTICS_EVENTS.experimentExposed, {
        experiment_key: experimentKey,
        variant_key: assignedVariant,
      })
    }

    void assignVariant()

    return () => {
      isActive = false
    }
  }, [experimentKey, user?.id, variants, variantsKey])

  return variant
}
