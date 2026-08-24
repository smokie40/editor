'use client'

export type ViewerStageFloorplanMove = Readonly<{
  nodeId: string
  delta: readonly [number, number]
}>

function finitePoint(value: readonly [number, number]): boolean {
  return value.every((entry) => Number.isFinite(entry))
}

export function resolveViewerStageFloorplanMove(
  nodeId: string,
  startClient: readonly [number, number],
  endClient: readonly [number, number],
  startPlan: readonly [number, number],
  endPlan: readonly [number, number],
  thresholdPx = 4,
): ViewerStageFloorplanMove | null {
  if (
    !nodeId.trim()
    || !finitePoint(startClient)
    || !finitePoint(endClient)
    || !finitePoint(startPlan)
    || !finitePoint(endPlan)
    || !Number.isFinite(thresholdPx)
    || thresholdPx < 0
  ) return null

  if (
    Math.hypot(endClient[0] - startClient[0], endClient[1] - startClient[1]) <= thresholdPx
  ) return null

  const delta = [endPlan[0] - startPlan[0], endPlan[1] - startPlan[1]] as const
  if (Math.hypot(delta[0], delta[1]) <= 1e-9) return null
  return Object.freeze({ nodeId, delta })
}
