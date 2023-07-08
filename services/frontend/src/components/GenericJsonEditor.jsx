import 'ace-builds/src-noconflict/ace';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-terminal';
import 'ace-builds/src-noconflict/theme-tomorrow';
import 'ace-builds/src-noconflict/theme-twilight';
import 'ace-builds/webpack-resolver';
import React, { useEffect, useState } from 'react';
import AceEditor from 'react-ace';

const GenericJsonEditor = ({
  onChange,
  placeholder = null,
  theme = 'twilight',
  height = '50vh',
  width = '100%',
  fontSize = 14,
  value = '{}',
  minLines = 20,
}) => {
  return (
    <AceEditor
      placeholder={placeholder}
      mode='json'
      theme={theme}
      width={width}
      height={height}
      minLines={minLines}
      fontSize={fontSize}
      showPrintMargin={true}
      showGutter={true}
      highlightActiveLine={true}
      value={value}
      onChange={onChange}
    />
  );
};

export { GenericJsonEditor };
