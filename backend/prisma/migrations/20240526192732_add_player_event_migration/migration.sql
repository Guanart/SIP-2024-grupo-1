-- CreateTable
CREATE TABLE "Player_event" (
    "player_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "Player_event_pkey" PRIMARY KEY ("player_id","event_id")
);

-- AddForeignKey
ALTER TABLE "Player_event" ADD CONSTRAINT "Player_event_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player_event" ADD CONSTRAINT "Player_event_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
