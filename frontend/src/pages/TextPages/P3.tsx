import { Box, Button, Input } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionsService } from '../../services/sectionsService';
export function P3() {
  const redir = useNavigate();
  function BackButtonHandler() {
    redir(-1);
  }

  const [sectionName, setSectionName] = useState<string>('');
  const [sectionStatus, setSectionStatus] = useState<string>('');

  const handleSave = useCallback(async (name?: string, status?: string) => {
    if (!name || !status) {
      console.error('Mandatory value not set');
      return;
    }
    const sectionsService = new SectionsService(); // TODO: move to context or other global
    const section = sectionsService.prepare({ name, status });
    await sectionsService.post(section);
    setSectionStatus('');
    setSectionName('');
  }, []);

  return (
    <Box>
      <button onClick={BackButtonHandler}>Back</button>
      <Box className="P2" style={{ fontSize: '40px' }}>
        <h1>Page2 content - Create sections</h1>
      </Box>

      <Box>
        Section Name:{' '}
        <Input
          onChange={(e) => setSectionName(e.target.value)}
          value={sectionName}
        ></Input>
      </Box>
      <Box>
        Section Status:{' '}
        <Input
          onChange={(e) => setSectionStatus(e.target.value)}
          value={sectionStatus}
        ></Input>
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={() => handleSave(sectionName, sectionStatus)}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
