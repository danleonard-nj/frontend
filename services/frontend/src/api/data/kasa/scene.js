const parseSceneMapping = (flow, scene) => {
  const mapping = {};

  for (const node of flow) {
    if (node.hasOwnProperty('source')) {
      if (!mapping.hasOwnProperty(node.source)) {
        mapping[node.source] = [];
      }
      mapping[node.source] = [...mapping[node.source], node.target];
    }
  }

  const result = [];
  for (const key of Object.keys(mapping)) {
    result.push({
      preset_id: key,
      devices: mapping[key],
    });
  }

  const model = {
    scene_id: scene.scene_id,
    scene_name: scene.scene_name,
    flow: flow,
    mapping: result,
  };

  return model;
};

const getNewScene = () => {
  return {
    scene_id: null,
    scene_name: '',
    mapping: [],
    flow: [],
  };
};

const getDeviceOptions = (devices, flow) => {
  const ids = flow.map((x) => x.id);
  return devices.filter((x) => !ids.includes(x.device_id));
};

const getPresetOptions = (presets, flow) => {
  const ids = flow.map((x) => x.id);
  return presets.filter((x) => !ids.includes(x.preset_id));
};

const getNewTask = (scene) => {
  return {
    taskName: scene.scene_name,
    endpoint: `http://kasa/api/scene/${scene.scene_id}/run`,
    identityClientId: null,
    method: 'POST',
    payload: {},
  };
};

const isJsonEditorVisible = (task) => ['POST', 'PUT'].includes(task?.method);

export {
  isJsonEditorVisible,
  getNewTask,
  getPresetOptions,
  getDeviceOptions,
  parseSceneMapping,
  getNewScene,
};
