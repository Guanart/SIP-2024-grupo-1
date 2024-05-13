-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "game" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "biography" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "max_player" INTEGER NOT NULL,
    "prize" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "game_id" INTEGER NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fundraising" (
    "id" SERIAL NOT NULL,
    "goal_amount" DOUBLE PRECISION NOT NULL,
    "prize_share" DOUBLE PRECISION NOT NULL,
    "risk_level" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "player_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "Fundraising_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "share_per_unit" DOUBLE PRECISION NOT NULL,
    "amount_left" INTEGER NOT NULL,
    "initial_amount" INTEGER NOT NULL,
    "initial_price" DOUBLE PRECISION NOT NULL,
    "fundraising_id" INTEGER NOT NULL,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_game_key" ON "Game"("game");

-- CreateIndex
CREATE UNIQUE INDEX "Player_user_id_key" ON "Player"("user_id");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraising" ADD CONSTRAINT "Fundraising_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fundraising" ADD CONSTRAINT "Fundraising_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_fundraising_id_fkey" FOREIGN KEY ("fundraising_id") REFERENCES "Fundraising"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
