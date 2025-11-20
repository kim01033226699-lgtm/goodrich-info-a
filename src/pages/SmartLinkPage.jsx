import './SmartLinkPage.css';

function SmartLinkPage() {
  const links = [
    {
      title: '지원금',
      description: '정착교육비, 활동수수료 등 안내',
      url: '/goodrich-info-a/',
      color: 'light'
    },
    {
      title: '금융캠퍼스',
      description: '무경력신입 지원 프로그램',
      url: 'https://kim01033226699-lgtm.github.io/gfe',
      color: 'medium'
    },
    {
      title: '스마트위촉',
      description: '원스톱위촉안내',
      url: 'https://kim01033226699-lgtm.github.io/appoint_info/',
      color: 'dark'
    }
  ];

  return (
    <div className="smart-link-page">
      <div className="smart-link-container">
        <header className="smart-link-header">
          <h1 className="smart-link-title">Smart Link</h1>
          <p className="smart-link-subtitle">Start Good, Grow Rich!</p>
        </header>

        <div className="link-cards">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className={`link-card link-card-${link.color}`}
            >
              <div className="link-card-content">
                <h2 className="link-card-title">{link.title}</h2>
                <p className="link-card-description">{link.description}</p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}

export default SmartLinkPage;
