import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Camera, Check, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface ProfileStepProps {
  onNext: () => void;
}

const ProfileStep = ({ onNext }: ProfileStepProps) => {
  const { user, profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState(profile?.display_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url ?? null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `${user.id}/avatar.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      
      if (uploadErr) throw uploadErr;

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      
      setAvatarUrl(publicUrl);
      toast.success("Photo uploaded!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Upload failed: " + msg);
    } finally {
      setUploading(false);
    }
  };

  const handleComplete = async () => {
    if (!user || !displayName.trim()) return;
    
    setSubmitting(true);
    try {
      const { error } = await supabase.rpc("update_my_profile", {
        p_display_name: displayName.trim(),
        p_avatar_url: avatarUrl,
        p_bio: bio.trim(),
      });

      if (error) throw error;
      
      onNext();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Please try again.";
      toast.error("Failed to save profile: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center w-full max-w-sm mx-auto px-6 text-center"
    >
      <div className="mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-2">
          Your Profile
        </h2>
        <p className="text-muted-foreground text-sm">
          How others will see you during matches.
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="relative mb-8 group">
        <Avatar className="w-28 h-28 border-4 border-card shadow-xl">
          <AvatarImage src={avatarUrl ?? undefined} className="object-cover" />
          <AvatarFallback className="text-3xl font-serif bg-primary/10 text-primary">
            {displayName ? displayName.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-50"
        >
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
        {!avatarUrl && (
          <p className="mt-3 text-[10px] text-primary font-medium uppercase tracking-widest animate-pulse">
            Upload a photo
          </p>
        )}
      </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="display-name" className="text-xs uppercase tracking-luxury text-muted-foreground ml-1">
            Display Name <span className="text-primary">*</span>
          </Label>
          <Input
            id="display-name"
            placeholder="e.g. Alex"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="h-12 bg-card border-border px-4"
            maxLength={30}
          />
          <div className="flex justify-end pr-1">
            <span className="text-[10px] text-muted-foreground/60">{displayName.length}/30</span>
          </div>
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="bio" className="text-xs uppercase tracking-luxury text-muted-foreground ml-1">
            Current Vibe / Role
          </Label>
          <Input
            id="bio"
            placeholder="e.g. Architect, curious about the world"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="h-12 bg-card border-border px-4"
            maxLength={100}
          />
          <div className="flex justify-end pr-1">
            <span className="text-[10px] text-muted-foreground/60">{bio.length}/100</span>
          </div>
        </div>

      <Button
        variant="gold"
        size="lg"
        onClick={handleComplete}
        disabled={!displayName.trim() || submitting || uploading}
        className="w-full group"
      >
        {submitting ? (
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
        ) : (
          <>
            Continue
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>
      
      <p className="mt-6 text-[10px] text-muted-foreground/50 uppercase tracking-widest">
        You can change these later in settings
      </p>
    </motion.div>
  );
};

export default ProfileStep;
