import { PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-tasks.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
