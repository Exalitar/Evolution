import React, { useState } from 'react';
import './Shop.css';
import { TabsCarousel, TabsCarouselItem } from './TabsCarousel';

type ShopCategory = 'all' | 'premium' | 'equip_boost' | 'synthesis_boost';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ShopCategory;
}

interface ShopProps {
  onClose: () => void;
  playerCurrency: number;
  onPurchase: (itemId: string, price: number) => void;
}

const categoryNames: Record<ShopCategory, string> = {
  all: 'Всё',
  premium: 'Премиум',
  equip_boost: 'Ускорители оборудования',
  synthesis_boost: 'Ускорители синтеза'
};

const shopItems: ShopItem[] = [
  // Премиум
  {
    id: 'premium_1d',
    name: 'Премиум на 1 день',
    description: 'Открывает все премиум‑функции игры на 24 часа.',
    price: 100,
    image: '/assets/Shop/Premium.png',
    category: 'premium'
  },
  {
    id: 'premium_1w',
    name: 'Премиум на 1 неделю',
    description: 'Премиум‑доступ на 7 дней: больше наград и бонусов.',
    price: 500,
    image: '/assets/Shop/Premium.png',
    category: 'premium'
  },
  {
    id: 'premium_1m',
    name: 'Премиум на 1 месяц',
    description: '30 дней премиума: максимум возможностей лаборатории.',
    price: 1500,
    image: '/assets/Shop/Premium.png',
    category: 'premium'
  },
  {
    id: 'premium_1y',
    name: 'Премиум на 1 год',
    description: '12 месяцев премиум‑подписки по выгодной цене.',
    price: 12000,
    image: '/assets/Shop/Premium.png',
    category: 'premium'
  },

  // Ускорители оборудования
  {
    id: 'equip_boost_1d',
    name: 'Ускоритель оборудования 1 день',
    description:
      'Все улучшения оборудования проходят в 2 раза быстрее в течение 24 часов.',
    price: 200,
    image: '/assets/Shop/Equipment accelerator.png',
    category: 'equip_boost'
  },
  {
    id: 'equip_boost_1w',
    name: 'Ускоритель оборудования 1 неделя',
    description: 'Ускорение улучшения оборудования на 7 дней.',
    price: 900,
    image: '/assets/Shop/Equipment accelerator.png',
    category: 'equip_boost'
  },
  {
    id: 'equip_boost_1m',
    name: 'Ускоритель оборудования 1 месяц',
    description: '30 дней ускоренной работы лабораторного оборудования.',
    price: 2500,
    image: '/assets/Shop/Equipment accelerator.png',
    category: 'equip_boost'
  },
  {
    id: 'equip_boost_1y',
    name: 'Ускоритель оборудования 1 год',
    description: 'Годовой максимальный буст скорости улучшений.',
    price: 18000,
    image: '/assets/Shop/Equipment accelerator.png',
    category: 'equip_boost'
  },

  // Ускорители синтеза
  {
    id: 'synth_boost_1d',
    name: 'Ускоритель синтеза 1 день',
    description:
      'Синтез материалов и существ происходит в 2 раза быстрее 24 часа.',
    price: 200,
    image: '/assets/Shop/Synthesis accelerator.png',
    category: 'synthesis_boost'
  },
  {
    id: 'synth_boost_1w',
    name: 'Ускоритель синтеза 1 неделя',
    description: 'Ускоренный синтез на 7 дней.',
    price: 900,
    image: '/assets/Shop/Synthesis accelerator.png',
    category: 'synthesis_boost'
  },
  {
    id: 'synth_boost_1m',
    name: 'Ускоритель синтеза 1 месяц',
    description: '30 дней ускоренного синтеза материалов.',
    price: 2500,
    image: '/assets/Shop/Synthesis accelerator.png',
    category: 'synthesis_boost'
  },
  {
    id: 'synth_boost_1y',
    name: 'Ускоритель синтеза 1 год',
    description: '12 месяцев максимальной скорости синтеза.',
    price: 18000,
    image: '/assets/Shop/Synthesis accelerator.png',
    category: 'synthesis_boost'
  }
];

export const Shop: React.FC<ShopProps> = ({
  onClose,
  playerCurrency,
  onPurchase
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<ShopCategory>('all');
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [purchaseStatus, setPurchaseStatus] =
    useState<'idle' | 'success' | 'error'>('idle');

  const filteredItems =
    selectedCategory === 'all'
      ? shopItems
      : shopItems.filter((item) => item.category === selectedCategory);

  const handlePurchaseClick = () => {
    if (!selectedItem) return;

    if (playerCurrency >= selectedItem.price) {
      onPurchase(selectedItem.id, selectedItem.price);
      setPurchaseStatus('success');
      setTimeout(() => {
        setPurchaseStatus('idle');
        setSelectedItem(null);
      }, 1500);
    } else {
      setPurchaseStatus('error');
      setTimeout(() => {
        setPurchaseStatus('idle');
      }, 2000);
    }
  };

  const tabsItems: TabsCarouselItem[] = [
    { id: 'all', label: 'Всё' },
    { id: 'premium', label: 'Премиум' },
    { id: 'equip_boost', label: 'Ускорители оборудования' },
    { id: 'synthesis_boost', label: 'Ускорители синтеза' }
  ];

  return (
    <div className="shop-screen">
      <div className="shop-header">
        <h2>Игровой магазин</h2>

        <div className="shop-currency">
          <span className="currency-icon">💎</span>
          <span className="currency-amount">{playerCurrency}</span>
        </div>

        <button className="shop-close-button" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="shop-content">
        {/* бесконечная карусель вкладок */}
        <div className="shop-tabs-wrapper">
          <TabsCarousel
            items={tabsItems}
            activeId={selectedCategory}
            onSelect={(id) => setSelectedCategory(id as ShopCategory)}
            height={42}
            autoSpeed={20}
          />
        </div>

        {/* сетка товаров */}
        <div className="shop-items-grid">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="shop-item-card"
              onClick={() => setSelectedItem(item)}
            >
              <div className="shop-item-image">
                <img src={item.image} alt={item.name} draggable={false} />
              </div>

              <div className="shop-item-info">
                <div className="shop-item-name">{item.name}</div>
                <div className="shop-item-price">
                  <span className="shop-item-current-price">
                    {item.price} 💎
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="shop-empty">
              В этом разделе пока нет товаров.
            </div>
          )}
        </div>
      </div>

      {selectedItem && (
        <div
          className="shop-modal-backdrop"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="shop-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="shop-modal-close"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>

            <div className="shop-modal-image">
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                draggable={false}
              />
            </div>

            <div className="shop-modal-content">
              <h3 className="shop-modal-title">{selectedItem.name}</h3>

              <p className="shop-modal-description">
                {selectedItem.description}
              </p>

              <div className="shop-modal-price">
                <span className="shop-modal-current-price">
                  {selectedItem.price} 💎
                </span>
              </div>

              <button
                className={
                  'shop-modal-buy-button ' + purchaseStatus
                }
                onClick={handlePurchaseClick}
                disabled={purchaseStatus !== 'idle'}
              >
                {purchaseStatus === 'idle' && 'Купить'}
                {purchaseStatus === 'success' && '✓ Куплено!'}
                {purchaseStatus === 'error' && 'Недостаточно средств'}
              </button>

              {playerCurrency < selectedItem.price &&
                purchaseStatus === 'idle' && (
                  <div className="shop-modal-warning">
                    Не хватает: {selectedItem.price - playerCurrency} 💎
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
