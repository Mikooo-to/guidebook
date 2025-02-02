import { Box, Button, Input, MenuItem, Select } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticlesService } from '../../services/articlesService';
import { TSection } from '../../types/Section';
import { SectionsService } from '../../services/sectionsService';
export function P2() {
  const redir = useNavigate();
  function BackButtonHandler() {
    redir(-1);
  }

  const [articleName, setArticleName] = useState<string>('');
  const [articleContent, setArticleContent] = useState<string>('');
  const [sectionId, setSectionId] = useState<string>('');
  const [sections, setSections] = useState<Array<TSection>>([]);

  const handleSave = useCallback(
    async (name: string, content: string, sectionId: string) => {
      if (!name || !content || !sectionId) {
        console.error('Mandatory value not set');
        return;
      }
      const articlesService = new ArticlesService(); // TODO: move to context or other global
      const article = articlesService.prepare({ name, content, sectionId });
      await articlesService.post(article);
      setArticleContent('');
      setArticleName('');
    },
    [],
  );

  useEffect(() => {
    const sectionsService = new SectionsService(); // TODO: move to context or other global
    sectionsService.get().then((gotSections) => setSections(gotSections));
  }, []);

  return (
    <Box>
      <button onClick={BackButtonHandler}>Back</button>
      <Box className="P2" style={{ fontSize: '40px' }}>
        <h1>Page2 content</h1>
      </Box>
      <Box>
        Section:{' '}
        <Select
          onChange={(e) => {
            console.log(e.target.value);
            setSectionId(e.target.value);
          }}
          value={sectionId}
        >
          {sections.map((section) => (
            <MenuItem key={section.id} value={section.id}>
              {section.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box>
        Article Name:{' '}
        <Input
          onChange={(e) => setArticleName(e.target.value)}
          value={articleName}
        ></Input>
      </Box>
      <Box>
        Article Content:{' '}
        <Input
          onChange={(e) => setArticleContent(e.target.value)}
          value={articleContent}
        ></Input>
      </Box>
      <Box>
        <Button
          variant="contained"
          onClick={() => handleSave(articleName, articleContent, sectionId)}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
}
