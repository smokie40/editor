import { compileSemanticPrintShellWithManifold } from './lib/print-shell-compiler-manifold-worker'
import { registerSemanticPrintShellCompiler } from './lib/print-shell-compiler-registry'

registerSemanticPrintShellCompiler(compileSemanticPrintShellWithManifold)

export { compileSemanticPrintShellWithManifold }
