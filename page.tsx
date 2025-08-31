function StatusPill({ ok }: { ok: boolean }) {
  const cls = ok
    ? "inline-flex items-center rounded-full bg-green-100 text-green-700 px-2 py-0.5 text-xs"
    : "inline-flex items-center rounded-full bg-red-100 text-red-700 px-2 py-0.5 text-xs"
  return <span className={cls}>{ok ? "Set" : "Missing"}</span>
}

export default function ConfigPage() {
  // Server Component: read envs safely on the server without exposing values
  const env = {
    EVM_RPC_URL: !!process.env.EVM_RPC_URL,
    EVM_PRIVATE_KEY: !!process.env.EVM_PRIVATE_KEY,
    EVM_NETWORK: !!process.env.EVM_NETWORK,
    EXPLORER_BASE_URL: !!process.env.EXPLORER_BASE_URL,

    TWILIO_ACCOUNT_SID: !!process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: !!process.env.TWILIO_AUTH_TOKEN,
    TWILIO_FROM: !!process.env.TWILIO_FROM,

    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    FROM_EMAIL: !!process.env.FROM_EMAIL,

    OTP_CHANNEL: !!process.env.OTP_CHANNEL,
    OTP_TTL_SECONDS: !!process.env.OTP_TTL_SECONDS,
    OTP_MAX_ATTEMPTS: !!process.env.OTP_MAX_ATTEMPTS,
    OTP_REQUESTS_PER_HOUR: !!process.env.OTP_REQUESTS_PER_HOUR,
  }

  const sepoliaReady = env.EVM_RPC_URL && env.EVM_PRIVATE_KEY
  const twilioReady = env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN && env.TWILIO_FROM
  const resendReady = env.RESEND_API_KEY && env.FROM_EMAIL

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-pretty">Project configuration checklist</h1>
        <p className="text-sm text-muted-foreground">
          This page checks for required environment variables without showing any secret values. Add variables in
          Project Settings → Environment Variables, then reload.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">On-chain anchoring (Sepolia)</h2>
        <div className="rounded-md border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <code className="text-sm">EVM_RPC_URL</code>
            <StatusPill ok={env.EVM_RPC_URL} />
          </div>
          <div className="flex items-center justify-between">
            <code className="text-sm">EVM_PRIVATE_KEY</code>
            <StatusPill ok={env.EVM_PRIVATE_KEY} />
          </div>
          <div className="flex items-center justify-between">
            <code className="text-sm">EVM_NETWORK</code>
            <StatusPill ok={env.EVM_NETWORK} />
          </div>
          <div className="flex items-center justify-between">
            <code className="text-sm">EXPLORER_BASE_URL</code>
            <StatusPill ok={env.EXPLORER_BASE_URL} />
          </div>

          <div className="mt-4 rounded bg-muted p-3 text-sm">
            <p className="font-medium mb-1">Suggested values:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>EVM_NETWORK=sepolia</li>
              <li>EXPLORER_BASE_URL=https://sepolia.etherscan.io</li>
              <li>EVM_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID</li>
              <li>EVM_PRIVATE_KEY=0xYOUR_SEPOLIA_PRIVATE_KEY</li>
            </ul>
            <p className="mt-2">
              Status: {sepoliaReady ? "Ready for live anchoring" : "Using safe mock fallback until both are set"}.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">OTP providers</h2>
        <div className="rounded-md border p-4 space-y-3">
          <h3 className="text-base font-medium">A) Twilio SMS</h3>
          <div className="flex items-center justify-between">
            <code className="text-sm">TWILIO_ACCOUNT_SID</code>
            <StatusPill ok={env.TWILIO_ACCOUNT_SID} />
          </div>
          <div className="flex items-center justify-between">
            <code className="text-sm">TWILIO_AUTH_TOKEN</code>
            <StatusPill ok={env.TWILIO_AUTH_TOKEN} />
          </div>
          <div className="flex items-center justify-between">
            <code className="text-sm">TWILIO_FROM</code>
            <StatusPill ok={env.TWILIO_FROM} />
          </div>

          <h3 className="text-base font-medium mt-6">B) Resend Email</h3>
          <div className="flex items-center justify-between">
            <code className="text-sm">RESEND_API_KEY</code>
            <StatusPill ok={env.RESEND_API_KEY} />
          </div>
          <div className="flex items-center justify-between">
            <code className="text-sm">FROM_EMAIL</code>
            <StatusPill ok={env.FROM_EMAIL} />
          </div>

          <div className="mt-4 rounded bg-muted p-3 text-sm">
            <p className="font-medium mb-1">Behavior:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>If Twilio is set, SMS OTP will be used.</li>
              <li>Else if Resend is set, Email OTP will be used.</li>
              <li>Else, demo OTP (123456) is used for testing.</li>
            </ul>
            <p className="mt-2">You can optionally set channel and limits:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>OTP_CHANNEL=auto | sms | email</li>
              <li>OTP_TTL_SECONDS=300</li>
              <li>OTP_MAX_ATTEMPTS=5</li>
              <li>OTP_REQUESTS_PER_HOUR=5</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Next steps</h2>
        <ol className="list-decimal pl-5 space-y-1 text-sm">
          <li>Add the missing variables in Project Settings → Environment Variables.</li>
          <li>Reload this page to confirm everything shows as “Set”.</li>
          <li>
            Issue a certificate at <code>/issue</code> and click “Anchor on-chain”.
          </li>
          <li>Verify via the generated URL; request OTP and complete checks.</li>
        </ol>
      </section>
    </main>
  )
}
