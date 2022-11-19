import { SketchPicker } from 'react-color';
import { useDispatch, useSelector } from 'react-redux';
import { setPreset } from '../../../store/kasa/presetSlice';

const fromPreset = (preset) => {
  const color = {
    hsl: { h: preset.definition.hue, s: preset.definition.saturation / 100 },
  };
  return color;
};

export default function KasaPresetLightColorSelector() {
  const preset = useSelector((x) => x.preset.preset);
  const dispatch = useDispatch();

  const handleColorChange = (color) => {
    if (preset?.preset_id) {
      dispatch(
        setPreset({
          ...preset,
          definition: { hue: color.hsl.h, saturation: color.hsl.s * 100 },
        })
      );
    }
  };

  return (
    <SketchPicker color={fromPreset(preset)} onChange={handleColorChange} />
  );
}
