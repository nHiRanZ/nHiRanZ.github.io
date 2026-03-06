'use client'

import Script from 'next/script'

const SNACK_ID = '@nhiranz/react-native-kenburns-view-example'

export function ExpoSnackEmbed() {
  return (
    <>
      <div
        data-snack-id={SNACK_ID}
        data-snack-platform="web"
        data-snack-preview="true"
        data-snack-theme="light"
        style={{
          overflow: 'hidden',
          background: '#fbfcfd',
          border: '1px solid var(--color-border, #e5e7eb)',
          borderRadius: '4px',
          height: 505,
          width: '100%',
        }}
      />
      <Script
        src="https://snack.expo.dev/embed.js"
        strategy="lazyOnload"
      />
    </>
  )
}
