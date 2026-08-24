import type { compileSemanticPrintShellWithManifold } from './print-shell-compiler-manifold-worker'

export type SemanticPrintShellCompiler = typeof compileSemanticPrintShellWithManifold

let semanticPrintShellCompiler: SemanticPrintShellCompiler | null = null

export function registerSemanticPrintShellCompiler(compiler: SemanticPrintShellCompiler) {
  semanticPrintShellCompiler = compiler
}

export function getSemanticPrintShellCompiler(): SemanticPrintShellCompiler | null {
  return semanticPrintShellCompiler
}
