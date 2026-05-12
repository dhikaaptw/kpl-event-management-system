import { EventAggregate } from 'src/domain/event/event.aggregate';

export interface EventRepository {
  save(event: EventAggregate): Promise<void>;

  findById(id: string): Promise<EventAggregate | null>;
}