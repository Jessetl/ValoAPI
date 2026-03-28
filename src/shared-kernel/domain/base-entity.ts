import { IDomainEvent } from './domain-event';

export abstract class BaseEntity {
  private _domainEvents: IDomainEvent[] = [];

  constructor(public readonly id: string) {}

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  pullDomainEvents(): IDomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents = [];
    return events;
  }

  equals(other: BaseEntity): boolean {
    if (!(other instanceof BaseEntity)) return false;
    return this.id === other.id;
  }
}
