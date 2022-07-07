-- CreateTable
CREATE TABLE "DataMetric" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "name" STRING NOT NULL,
    "value" FLOAT8 NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataMetric_pkey" PRIMARY KEY ("id")
);
