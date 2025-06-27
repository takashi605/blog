import BackButton from './backButton';
import HorizontalStack from './HorizontalStack';
import PageTitle from './pageTitle';

interface PageHeaderProps {
  title: string;
  backButtonTo: string;
  backButtonText: string;
}

export default function PageHeader({
  title,
  backButtonTo,
  backButtonText,
}: PageHeaderProps) {
  return (
    <HorizontalStack>
      <PageTitle>{title}</PageTitle>
      <BackButton to={backButtonTo}>{backButtonText}</BackButton>
    </HorizontalStack>
  );
}
