import React from 'react';
import ReactFlow, { addEdge, updateEdge } from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import { updateFlowState } from '../../../store/kasa/actions/flowActions';

const KasaSceneFlow = () => {
  const dispatch = useDispatch();
  const { flow = [] } = useSelector((x) => x.flow);

  const onConnect = (params) => {
    dispatch(
      updateFlowState((flow) =>
        addEdge({ ...params, animated: true }, flow)
      )
    );
  };

  const handleNodeChange = (event, node) => {
    dispatch(
      updateFlowState((flow) => [
        ...flow.filter((x) => x.id !== node.id),
        node,
      ])
    );
  };

  const handleEdgeUpdate = (oldEdge, newConnection) => {
    dispatch(
      updateFlowState((flow) =>
        updateEdge(oldEdge, newConnection, flow)
      )
    );
  };

  const handleRemoveElement = (event, element) => {
    dispatch(
      updateFlowState((flow) => [
        ...flow.filter(
          (x) => x.id !== element.id && x.source !== element.id
        ),
      ])
    );
  };

  return (
    <ReactFlow
      elements={flow}
      onConnect={onConnect}
      onNodeDragStop={handleNodeChange}
      onEdgeUpdate={handleEdgeUpdate}
      connectionMode='loose'
      onEdgeDoubleClick={handleRemoveElement}
      onNodeDoubleClick={handleRemoveElement}
    />
  );
};

export { KasaSceneFlow };
