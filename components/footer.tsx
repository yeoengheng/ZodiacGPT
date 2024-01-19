import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Check out the GitHub Repo{' '}
      <ExternalLink href="https://github.com/yeoengheng/ZodiacGPT">here</ExternalLink>
      .
    </p>
  )
}
