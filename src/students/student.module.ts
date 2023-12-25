import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentSchema } from './student.schema';
import { Student } from './student.schema';
import { ClassroomModule } from 'src/classrooms/classroom.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Student.name, schema: StudentSchema }]),
    ClassroomModule
  ],
  controllers: [StudentController],
  providers: [StudentService],
  exports: []
})
export class StudentModule {}
