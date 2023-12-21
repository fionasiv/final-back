import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassroomController } from './classroom.controller';
import { ClassroomService } from './classroom.service';
import { ClassroomSchema } from './classroom.schema';
import { Classroom } from './classroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Classroom.name, schema: ClassroomSchema },
    ]),
  ],
  controllers: [ClassroomController],
  providers: [ClassroomService],
  exports: [ClassroomService]
})
export class ClassroomModule {}
