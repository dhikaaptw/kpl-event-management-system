import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { GetEventDetailsQuery } from './get-event-details.query';
import { EventDto } from '../dtos/event.dto';
import { EVENT_QUERY_REPOSITORY, EventQueryRepository } from './get-published-events.handler';

@Injectable()
export class GetEventDetailsHandler {
  constructor(
    @Inject(EVENT_QUERY_REPOSITORY)
    private readonly eventQueryRepository: EventQueryRepository,
  ) {}

  async execute(query: GetEventDetailsQuery): Promise<EventDto> {
    const event = await this.eventQueryRepository.findEventWithDetails(query.eventId);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }
}
