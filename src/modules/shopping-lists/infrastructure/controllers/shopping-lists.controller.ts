import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from '../../../../shared-kernel/infrastructure/decorators/current-user.decorator';
import { ParseUUIDPipe } from '../../../../shared-kernel/infrastructure/pipes/parse-uuid.pipe';
import type { FirebaseUser } from '../../../../shared-kernel/infrastructure/guards/firebase-auth.guard';
import { SyncFirebaseUserUseCase } from '../../../users/application/use-cases/sync-firebase-user.use-case';
import { CreateShoppingListUseCase } from '../../application/use-cases/create-shopping-list.use-case';
import { GetShoppingListsUseCase } from '../../application/use-cases/get-shopping-lists.use-case';
import { GetShoppingListByIdUseCase } from '../../application/use-cases/get-shopping-list-by-id.use-case';
import { UpdateShoppingListUseCase } from '../../application/use-cases/update-shopping-list.use-case';
import { DeleteShoppingListUseCase } from '../../application/use-cases/delete-shopping-list.use-case';
import { CreateShoppingListDto } from '../../application/dtos/create-shopping-list.dto';
import { DeleteShoppingListResponseDto } from '../../application/dtos/delete-shopping-list-response.dto';
import { UpdateShoppingListDto } from '../../application/dtos/update-shopping-list.dto';
import { ShoppingListResponseDto } from '../../application/dtos/shopping-list-response.dto';

@ApiTags('Shopping Lists')
@ApiBearerAuth('firebase-token')
@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(
    private readonly createShoppingList: CreateShoppingListUseCase,
    private readonly getShoppingLists: GetShoppingListsUseCase,
    private readonly getShoppingListById: GetShoppingListByIdUseCase,
    private readonly updateShoppingList: UpdateShoppingListUseCase,
    private readonly deleteShoppingList: DeleteShoppingListUseCase,
    private readonly syncFirebaseUser: SyncFirebaseUserUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear lista de compras con items opcionales' })
  @ApiResponse({
    status: 201,
    description: 'Lista creada exitosamente',
    type: ShoppingListResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 401, description: 'Token invalido o ausente' })
  async create(
    @CurrentUser() firebaseUser: FirebaseUser,
    @Body() dto: CreateShoppingListDto,
  ) {
    const userId = await this.resolveUserId(firebaseUser);
    return this.createShoppingList.execute({ userId, dto });
  }

  @Get()
  @ApiOperation({ summary: 'Listar listas activas del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Listas activas del usuario',
    type: [ShoppingListResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Token invalido o ausente' })
  async findAll(@CurrentUser() firebaseUser: FirebaseUser) {
    const userId = await this.resolveUserId(firebaseUser);
    return this.getShoppingLists.execute(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de una lista de compras' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la lista de compras',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalle de la lista',
    type: ShoppingListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token invalido o ausente' })
  @ApiResponse({ status: 404, description: 'Lista no encontrada' })
  async findOne(
    @CurrentUser() firebaseUser: FirebaseUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userId = await this.resolveUserId(firebaseUser);
    return this.getShoppingListById.execute({ listId: id, userId });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Editar lista (nombre, tienda, iva_enabled)' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la lista de compras',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista actualizada',
    type: ShoppingListResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada invalidos' })
  @ApiResponse({ status: 401, description: 'Token invalido o ausente' })
  @ApiResponse({ status: 404, description: 'Lista no encontrada' })
  async update(
    @CurrentUser() firebaseUser: FirebaseUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateShoppingListDto,
  ) {
    const userId = await this.resolveUserId(firebaseUser);
    return this.updateShoppingList.execute({ listId: id, userId, dto });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar lista de compras' })
  @ApiParam({
    name: 'id',
    description: 'UUID de la lista de compras',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista eliminada exitosamente',
    type: DeleteShoppingListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Token invalido o ausente' })
  @ApiResponse({ status: 404, description: 'Lista no encontrada' })
  async remove(
    @CurrentUser() firebaseUser: FirebaseUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const userId = await this.resolveUserId(firebaseUser);
    return this.deleteShoppingList.execute({ listId: id, userId });
  }

  /**
   * Traduce el FirebaseUser (capa HTTP) a userId interno (capa aplicacion).
   * Crea el usuario en BD si no existe (sync desde Firebase).
   */
  private async resolveUserId(firebaseUser: FirebaseUser): Promise<string> {
    const email = firebaseUser.email?.trim();
    const hasValidEmail =
      typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!firebaseUser.uid || !hasValidEmail) {
      throw new UnauthorizedException('Invalid Firebase token payload');
    }

    const user = await this.syncFirebaseUser.execute({
      firebaseUid: firebaseUser.uid,
      email,
    });
    return user.id;
  }
}
