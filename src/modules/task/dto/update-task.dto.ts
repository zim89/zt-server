import { PartialType } from '@nestjs/swagger';

import { CreateTaskDto } from './create-task.dto';

/**
 * DTO for updating a task
 * All fields from CreateTaskDto are optional
 */
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
