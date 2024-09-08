import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

@Injectable()
export class ClusterService implements OnModuleInit{
    constructor(private readonly clientsModule: ClientsModule) {}

  onModuleInit() {
    const client = this.clientsModule.getClient(Transport.TCP);

    client.listen(() => console.log('Worker is listening'));
  }
}
