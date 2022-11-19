import React from 'react';
import ReactFlow, { addEdge, updateEdge } from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import { updateFlowState } from '../../../store/kasa/actions/flowActions';

export default function KasaSceneFlow() {
  const dispatch = useDispatch();
  const elements = useSelector((x) => x.flow?.flow) ?? [];

  function onConnect(params) {
    dispatch(
      updateFlowState((flow) => addEdge({ ...params, animated: true }, flow))
    );
  }

  function handleNodeChange(event, node) {
    dispatch(
      updateFlowState((flow) => [...flow.filter((x) => x.id !== node.id), node])
    );
  }

  function handleEdgeUpdate(oldEdge, newConnection) {
    dispatch(
      updateFlowState((flow) => updateEdge(oldEdge, newConnection, flow))
    );
  }

  function handleRemoveElement(event, element) {
    dispatch(
      updateFlowState((flow) => [
        ...flow.filter((x) => x.id !== element.id && x.source !== element.id),
      ])
    );
  }

  return (
    <ReactFlow
      elements={elements}
      onConnect={onConnect}
      onNodeDragStop={handleNodeChange}
      onEdgeUpdate={handleEdgeUpdate}
      connectionMode='loose'
      onEdgeDoubleClick={handleRemoveElement}
      onNodeDoubleClick={handleRemoveElement}
    />
  );
}
