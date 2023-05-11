export const aliFunctionsKeys = {
  list: (projectRef: string | undefined) => ['projects', projectRef, 'functions'] as const,
  detail: (projectRef: string | undefined, slug: string | undefined) =>
    ['projects', projectRef, 'function', slug] as const,
}
