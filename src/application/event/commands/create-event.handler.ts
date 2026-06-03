import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateEventCommand } from './create-event.command';
import { EventAggregate } from 'src/domain/event/event.aggregate';
import { EventRepository } from 'src/domain/event/event.repository';

export const EVENT_REPOSITORY = 'EventRepository';

@Injectable()
export class CreateEventHandler {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: CreateEventCommand): Promise<string> {
    const event = EventAggregate.create({
      id: uuidv4(),
      organizerId: command.organizerId,
      name: command.name,
      description: command.description,
      startDate: command.startDate,
      endDate: command.endDate,
      location: command.location,
      maximumCapacity: command.maximumCapacity,
    });

    await this.eventRepository.save(event);
    return event.id;
  }
}
