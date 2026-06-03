import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PublishEventCommand } from './publish-event.command';
import { EventRepository } from 'src/domain/event/event.repository';
import { EVENT_REPOSITORY } from './create-event.handler';

@Injectable()
export class PublishEventHandler {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: PublishEventCommand): Promise<void> {
    const event = await this.eventRepository.findById(command.eventId);
    if (!event) throw new NotFoundException('Event not found');

    event.publish();
    await this.eventRepository.save(event);
  }
}
