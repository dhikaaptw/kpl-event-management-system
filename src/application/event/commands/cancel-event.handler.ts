import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CancelEventCommand } from './cancel-event.command';
import { EventRepository } from 'src/domain/event/event.repository';
import { EVENT_REPOSITORY } from './create-event.handler';

@Injectable()
export class CancelEventHandler {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: CancelEventCommand): Promise<void> {
    const event = await this.eventRepository.findById(command.eventId);
    if (!event) throw new NotFoundException('Event not found');

    event.cancel();
    await this.eventRepository.save(event);
  }
}
