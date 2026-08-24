import { registerSemanticPrintShellCompiler } from './lib/print-shell-compiler-registry'
import { compileSemanticPrintShellWithManifold } from './lib/print-shell-compiler-manifold-worker'

registerSemanticPrintShellCompiler(compileSemanticPrintShellWithManifold)

export { compileSemanticPrintShellWithManifold }
