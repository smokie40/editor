import { describe, expect, test } from 'bun:test'
import { resolveViewerStageFloorplanPointPick } from './viewer-stage-floorplan-point-pick'

describe('viewer stage floorplan host point pick', () => {
  test('returns the plan-local point for a click-sized gesture', () => {
    expect(resolveViewerStageFloorplanPointPick([10, 10], [12, 11], [1.25, 3.5])).toEqual([1.25, 3.5])
  })

  test('does not treat a pan as a point pick', () => {
    expect(resolveViewerStageFloorplanPointPick([10, 10], [20, 14], [1.25, 3.5])).toBeNull()
  })

  test('fails closed on invalid coordinates or threshold', () => {
    expect(resolveViewerStageFloorplanPointPick([10, 10], [10, 10], [Number.NaN, 3])).toBeNull()
    expect(resolveViewerStageFloorplanPointPick([10, 10], [10, 10], [1, 3], -1)).toBeNull()
  })
})
