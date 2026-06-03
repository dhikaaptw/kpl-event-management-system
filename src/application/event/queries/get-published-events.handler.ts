import { Inject, Injectable } from '@nestjs/common';
import { GetPublishedEventsQuery } from './get-published-events.query';
import { EventDto } from '../dtos/event.dto';

export const EVENT_QUERY_REPOSITORY = 'EventQueryRepository';

export abstract class EventQueryRepository {
  abstract findPublishedEvents(filterDate?: Date, filterLocation?: string): Promise<EventDto[]>;
  abstract findEventWithDetails(eventId: string): Promise<EventDto | null>;
  abstract getSalesReport(eventId: string): Promise<any>;
  abstract getParticipants(eventId: string): Promise<any[]>;
}

@Injectable()
export class GetPublishedEventsHandler {
  constructor(
    @Inject(EVENT_QUERY_REPOSITORY)
    private readonly eventQueryRepository: EventQueryRepository,
  ) {}

  async execute(query: GetPublishedEventsQuery): Promise<EventDto[]> {
    return this.eventQueryRepository.findPublishedEvents(
      query.filterDate,
      query.filterLocation,
    );
  }
}
