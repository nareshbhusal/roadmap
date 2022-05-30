import {
    Stack,
    Text,
    Flex
} from '@chakra-ui/react';

import { useDrop } from "react-dnd";
import Column, { CreateColumn } from './Column';
import { BoardList } from '../../types';

export interface BoardProps {
  boardData: any;
}

const Board: React.FC<BoardProps> = ({ boardData }) => {

  const [collectedProps, drop] = useDrop(() => ({
    accept: 'list',
  }));

  return (
    <Flex
      ref={drop}
      height={'100%'}
    >
      <Flex
        border={'1px solid #ccc'}
        // width={'500px'}
        backgroundColor={'gray.600'}
        alignItems= {'flex-start'}
        flexGrow={'1'}
        py={'15px'}
        // minHeight={'300px'}
        height={'100%'}
        overflowX={'auto'}
      >
        {boardData.lists.sort((a: BoardList, b: BoardList) => a.position - b.position).map((list: BoardList) => (
          <Column boardId={boardData.id} key={list.id} list={list} />
        ))}
        <CreateColumn boardId={boardData.id} />
      </Flex>
    </Flex>
  );
}

export default Board;
