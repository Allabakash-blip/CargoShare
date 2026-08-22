"""add amount to bookings

Revision ID: 9de9ac0d8383
Revises: 938650dd66e5
Create Date: 2026-08-22 07:51:24.927503

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9de9ac0d8383'
down_revision: Union[str, Sequence[str], None] = '938650dd66e5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "bookings",
        sa.Column(
            "amount",
            sa.Float(),
            nullable=True
        )
    )

    # Give existing bookings a temporary value
    op.execute(
        "UPDATE bookings SET amount = 0 WHERE amount IS NULL"
    )

    # Make the column required for future bookings
    op.alter_column(
        "bookings",
        "amount",
        existing_type=sa.Float(),
        nullable=False
    )


def downgrade() -> None:
    op.drop_column(
        "bookings",
        "amount"
    )