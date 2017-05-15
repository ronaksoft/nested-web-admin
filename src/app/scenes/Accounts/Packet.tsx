import PacketState from './PacketState';
import IUnique from './IUnique';
import _ from 'lodash';

export default class Packet<T> implements IUnique {
  key: string;
  model: T;
  status: PacketState;
  messages: string[];

  constructor(model: T) {
    this.key = _.uniqueId();
    this.model = model;
    this.state = PacketState.New;
    this.messages = [];

    this.isSuccessfull = this.isSuccessfull.bind(this);
  }

  isSuccessfull() {
    return this.state === PacketState.Success;
  }
}
