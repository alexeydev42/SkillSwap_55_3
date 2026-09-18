import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProfileSidebar } from './ProfileSidebar';

const EXPECTED_ITEMS = [
  { id: 'favorites', label: 'Избранное' },
  { id: 'skills', label: 'Мои навыки' },
  { id: 'personal', label: 'Личные данные' },
];

describe('ProfileSidebar', () => {
  it('отображает все пункты меню с ожидаемыми подписями', () => {
    render(<ProfileSidebar activeTab="personal" onTabClick={() => {}} />);

    EXPECTED_ITEMS.forEach(({ label }) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('помечает активным только пункт, соответствующий activeTab', () => {
    render(<ProfileSidebar activeTab="favorites" onTabClick={() => {}} />);

    expect(screen.getByRole('button', { name: 'Избранное' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    EXPECTED_ITEMS.filter(({ id }) => id !== 'favorites').forEach(({ label }) => {
      expect(screen.getByRole('button', { name: label })).not.toHaveAttribute('aria-current');
    });
  });

  it.each(EXPECTED_ITEMS)(
    'вызывает onTabClick с id "$id" при клике на пункт "$label"',
    ({ id, label }) => {
      const handleTabClick = vi.fn();
      render(<ProfileSidebar activeTab="personal" onTabClick={handleTabClick} />);

      fireEvent.click(screen.getByRole('button', { name: label }));

      expect(handleTabClick).toHaveBeenCalledTimes(1);
      expect(handleTabClick).toHaveBeenCalledWith(id);
    },
  );
});
