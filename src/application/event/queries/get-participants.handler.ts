import { Inject, Injectable } from '@nestjs/common';
import { GetParticipantsQuery } from './get-participants.query';
import { ParticipantDto } from '../dtos/event.dto';
import { EVENT_QUERY_REPOSITORY, EventQueryRepository } from './get-published-events.handler';

@Injectable()
export class GetParticipantsHandler {
  constructor(
    @Inject(EVENT_QUERY_REPOSITORY)
    private readonly eventQueryRepository: EventQueryRepository,
  ) {}

  async execute(query: GetParticipantsQuery): Promise<ParticipantDto[]> {
    return this.eventQueryRepository.getParticipants(query.eventId);
  }
}
