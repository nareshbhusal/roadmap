import {
  Flex,
  Stack,
  Box,
  Heading,
  Button
} from '@chakra-ui/react';
import { useSortable } from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import { db } from '../db';

export const listStringToId = (listString: string) => parseInt(listString.replace('list-', ''));
export const listIdToString = (listId: number) => `list-${listId}`;

export interface ColumnWrapperProps {
  children: React.ReactNode;
  styleProps: Object;
  innerRef?: React.RefObject<HTMLDivElement>;
  dataType?: string;
}

const ColumnWrapper: React.FC<ColumnWrapperProps> = ({ children, styleProps, innerRef, dataType }) => {
  dataType = dataType || '';
  return (
    <Stack
      mx={'4px'}
      // ref={innerRef}
      my={'2px'}
      flexShrink={0}
      borderRadius={'4px'}
      data-type={dataType}
      fontSize={'sm'}
      width={'250px'}
      pb={1}
      pt={0}
      px={0}
      {...styleProps}
    >
      {children}
    </Stack>
  );
}


export const CreateColumn: React.FC<{boardId: number; refreshData: Function;}> = ({ boardId, refreshData }) => {

  return (
    <ColumnWrapper
      styleProps={{
        mb: '3rem'
      }}>
      <Button
        bg={'gray.200'}
        _hover={{ opacity: 1 }}
        opacity={0.7}
        variant="outline"
        color={'black'}
        onClick={async () => {
          const columnName = window.prompt('Enter a column name:');
          if (columnName != null) {
            await db.addBoardList(columnName, boardId);
            refreshData();
          } else {
            console.log('cancelled');
          }
        }}
        textAlign={'left'}
        fontWeight={'regular'}
        display={'block'}>
        + Create Column
      </Button>
    </ColumnWrapper>
  );
}


export default function Panel({ list, children, refreshData }: any) {
  const {
    active,
    attributes,
    isDragging,
    listeners,
    over,
    setNodeRef,
    transition,
    transform,
  } = useSortable({
    id: list.id,
  });
  const items = list.stories.map((item: any) => item.id);
  const isOverContainer = over
    ? (list.id === over.id && active?.data.current?.type !== "container") ||
      items.includes(over.id)
    : false;

    // console.log("panel: ", panel.id);
  const opacity = isDragging ? 0.5 : undefined;

  return (
    <Stack
      className={`column ${list.id}`}
      // background={'gray.200'}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Transform.toString(transform),
        // backgroundColor: isOverContainer && "rgb(235, 235, 235, 1)",
        opacity
        // "--translatePanel-x": transform
        //   ? `${Math.round(transform.x)}px`
        //   : undefined,
        // "--translatePanel-y": transform
        //   ? `${Math.round(transform.y)}px`
        //   : undefined,
        // "--scalePanel-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
        // "--scalePanel-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
      }}
    >
      <ColumnWrapper
        styleProps={{
          // backgroundColor: isOverContainer ? 'red.200' : 'gray.200',
          backgroundColor: 'gray.200',
          opacity,
        }}
        dataType={'list'}>
      <Box
        className={`column-header ${list.id}`}
      >
        <Heading
          as={'h3'}
          mb={'3px'}
          p={'4px'}
          {...listeners}
          {...attributes}
          className="panel__title"
          cursor={'pointer'}
          fontWeight={'semibold'}
          textAlign={'center'}
          size={'sm'}>
          {list.name}
        </Heading>
      </Box>
        <Stack
          px={'7px'}
          spacing={'5px'}
          mb={'2px'}
        >
          {children}
        </Stack>
        <Flex
          px={'7px'}
          w={'100%'}
          className={`column-footer ${list.id}`}
        >
          <Button
            onClick={async () => {
              const storyTitle = window.prompt('Enter a story title:');
              if (storyTitle != null) {
                await db.addStory({
                  title: storyTitle,
                  listId: listStringToId(list.id),
                  boardId: list.boardId
                });
                refreshData();
              }
            }}
            bg={'gray.200'}
            _hover={{
              bg: 'gray.300',
            }}
            display={'block'}
            w={'100%'}
          >
            + Add Story
          </Button>
        </Flex>
      </ColumnWrapper>
    </Stack>
  );
}
