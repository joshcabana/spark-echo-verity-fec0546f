

# Publishing to Live Domain

## What's needed

The onboarding code is already in the codebase and working in preview. To make it live on `getverity.com.au`, you need to **publish** the project.

## How to publish

1. **Desktop**: Click the **Publish** button (web/globe icon) in the top-right corner of the editor
2. **Mobile**: Tap the **...** button in the bottom-right → **Publish**
3. In the dialog, click **Update** to push the latest frontend to production

## Important notes

- I cannot click the Publish button for you — this is a manual action in the Lovable UI
- Backend changes (edge functions like `agora-demo-token`, database migrations) are **already deployed automatically**
- Only the frontend needs publishing via the button
- CDN cache is automatically invalidated on publish — no manual cache clearing is needed
- Custom domain serving is handled automatically once published

## After publishing

Once you click Update, the live site at `https://getverity.com.au/onboarding` will serve the new 3-step wizard within a few minutes. You can verify by visiting the URL directly.

