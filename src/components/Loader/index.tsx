import React, { useState } from 'react';
import { Spring } from 'react-spring/renderprops';

import { Container } from './styles';

const Loader: React.FC = () => {
  const [reload, setReload] = useState(false);

  return (
    <Container>
      <Spring
        reset
        from={{ opacity: 1, diameter: 0 }}
        to={{ opacity: 0, diameter: 400 }}
        onRest={() => setReload(!reload)}
      >
        {props => (
          <div
            style={{
              width: props.diameter,
              height: props.diameter,
              opacity: props.opacity,
              position: 'absolute',
              top: '50%',
              left: '50%',
              border: '10px solid #004b50',
              borderRadius: '100%',
              transform: 'translateX(-50%) translateY(-50%)',
            }}
          />
        )}
      </Spring>
    </Container>
  );
};

export default Loader;
