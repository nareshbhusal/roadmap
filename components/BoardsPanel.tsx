import {
    Flex,
    FormControl,
    Input,
    Stack,
    Button
} from '@chakra-ui/react';
import { useState } from 'react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

export interface BoardsPanelProps {
  setActiveBoard: Function;
  activeBoardId: number;
}

const BoardsPanel: React.FC<BoardsPanelProps> = ({ setActiveBoard, activeBoardId }) => {
  const [boardTitle, setBoardTitle] = useState('');
  const boards = useLiveQuery(() =>
    db.boards.toArray()) || [];

  const handleSubmit = (e: any) => {
    e.preventDefault();
    db.addBoard(boardTitle);
  };

  return (
    <Stack
      spacing={4}
      h="100%"
      maxW="sm"
      p={4}
    >
      <Flex
        flexDirection={'row'}
      >
      <FormControl
        display={'flex'}
      >
        <Input
          id="board-title"
          placeholder="Board title"
          w={'230px'}
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
        />
        <Button
          type="submit"
          marginLeft={1}
          background={'green'}
          color={'white'}
          p={1}
          onClick={handleSubmit}
        >
          Create Board
        </Button>
      </FormControl>
      </Flex>
      <Flex>
        {boards.map((board) => (
          <Button
            key={board.id}
            m={1}
            border={board.id === activeBoardId ? '2px solid #00bcd4' : '2px solid #e0e0e0'}
            backgroundColor="blue"
            _hover={{ backgroundColor: 'blue.500' }}
            color={'white'}
            onClick={() => {
              setActiveBoard(board.id);
            }}
          >
            {board.name}
          </Button>
        ))}
      </Flex>
    </Stack>
  );
}

export default BoardsPanel;
