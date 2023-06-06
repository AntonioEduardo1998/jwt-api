-- CreateTable
CREATE TABLE "PayableTitle" (
    "id" SERIAL NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "originalAmount" DOUBLE PRECISION NOT NULL,
    "situation" TEXT NOT NULL,
    "openAmount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayableTitle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMovement" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "movementType" TEXT NOT NULL,
    "payableTitleId" INTEGER NOT NULL,

    CONSTRAINT "PaymentMovement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentMovement" ADD CONSTRAINT "PaymentMovement_payableTitleId_fkey" FOREIGN KEY ("payableTitleId") REFERENCES "PayableTitle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
