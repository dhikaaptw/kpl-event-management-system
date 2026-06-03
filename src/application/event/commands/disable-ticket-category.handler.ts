import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DisableTicketCategoryCommand } from './disable-ticket-category.command';
import { EventRepository } from 'src/domain/event/event.repository';
import { EVENT_REPOSITORY } from './create-event.handler';

@Injectable()
export class DisableTicketCategoryHandler {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: EventRepository,
  ) {}

  async execute(command: DisableTicketCategoryCommand): Promise<void> {
    const event = await this.eventRepository.findById(command.eventId);
    if (!event) throw new NotFoundException('Event not found');

    event.disableTicketCategory(command.ticketCategoryId);
    await this.eventRepository.save(event);
  }
}
