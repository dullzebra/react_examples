import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Tooltip from '_components/Tooltip/Tooltip';
import url from '_config/url';

const ExportButton = () => (
  <Tooltip tooltip='Экспортировать в Excel'>
    <Button bsStyle='link' bsSize='large' href={url.orderExportTemplate}>
      <Glyphicon glyph='glyphicon glyphicon-export' />
    </Button>
  </Tooltip>
);

export default ExportButton;


