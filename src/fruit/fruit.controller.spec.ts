import { Test, TestingModule } from '@nestjs/testing';
import { FruitController } from './fruit.controller';

describe('FruitController', () => {
  let controller: FruitController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FruitController],
    }).compile();

    controller = module.get<FruitController>(FruitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
