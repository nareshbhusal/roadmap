import {
  Stack,
  Flex,
  Heading,
  Text,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react';
import { db } from '../../db';

const Tasks: React.FC<any> = ({ tasks }) => {
  // tasks is a list of tasks objects that have a property called 'id' and 'name' and 'isCompleted'
  // render a list of tasks as checklists that can be completed or not completed

  return (
    <Stack
      spacing={'10px'}
    >
      <Heading
        fontWeight={'semibold'}
        fontSize={'15px'}>
        Tasks
      </Heading>
      <Flex
        marginTop={'10px'}>
        <Flex
          flexDirection={'column'}
          width={'auto'}
          justifyContent={'flex-left'}>
          {tasks.map((task: any) => {
            return (
              <Flex
                key={task.id}
                marginBottom={'5px'}>
                <Checkbox
                  isChecked={task.isCompleted}
                  onChange={() => db.updateTask(task.id, { isCompleted: !task.isCompleted })}
                >
                  {task.name}
                </Checkbox>
              </Flex>
            )
          }
          )}
        </Flex>
        <Text>
          // todo: implement a list of editable, deletable, sortable tasks
        </Text>
      </Flex>
    </Stack>
  );
}

export default Tasks;
