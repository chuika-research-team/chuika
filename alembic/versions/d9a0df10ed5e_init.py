"""init

Revision ID: d9a0df10ed5e
Revises:
Create Date: 2026-11-16 16:29:35.879165

"""

from collections.abc import Sequence

# revision identifiers, used by Alembic.
revision: str = "d9a0df10ed5e"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""


def downgrade() -> None:
    """Downgrade schema."""
