import { describe, expect, test } from 'bun:test'
import {
  resolveViewerStageFloorplanNodePointPick,
  resolveViewerStageFloorplanPointPick,
} from './viewer-stage-floorplan-point-pick'

describe('viewer stage floorplan host point pick', () => {
  test('returns the plan-local point for a click-sized gesture', () => {
    expect(resolveViewerStageFloorplanPointPick([10, 10], [12, 11], [1.25, 3.5])).toEqual([
      1.25, 3.5,
    ])
  })

  test('does not treat a pan as a point pick', () => {
    expect(resolveViewerStageFloorplanPointPick([10, 10], [20, 14], [1.25, 3.5])).toBeNull()
  })

  test('fails closed on invalid coordinates or threshold', () => {
    expect(resolveViewerStageFloorplanPointPick([10, 10], [10, 10], [Number.NaN, 3])).toBeNull()
    expect(resolveViewerStageFloorplanPointPick([10, 10], [10, 10], [1, 3], -1)).toBeNull()
  })

  test('returns a node-bound point only when the click ends on the same node', () => {
    expect(
      resolveViewerStageFloorplanNodePointPick(
        'wall-1',
        'wall-1',
        [10, 10],
        [12, 11],
        [2.5, 0],
      ),
    ).toEqual({ nodeId: 'wall-1', point: [2.5, 0] })

    expect(
      resolveViewerStageFloorplanNodePointPick(
        'wall-1',
        'wall-2',
        [10, 10],
        [12, 11],
        [2.5, 0],
      ),
    ).toBeNull()
  })

  test('does not treat a node pan or empty node id as a node point pick', () => {
    expect(
      resolveViewerStageFloorplanNodePointPick(
        'wall-1',
        'wall-1',
        [10, 10],
        [20, 14],
        [2.5, 0],
      ),
    ).toBeNull()
    expect(
      resolveViewerStageFloorplanNodePointPick('', '', [10, 10], [10, 10], [2.5, 0]),
    ).toBeNull()
  })
})
