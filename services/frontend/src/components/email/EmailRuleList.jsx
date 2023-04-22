import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedEmailRule } from '../../store/email/emailSlice';
import Spinner from '../Spinner';

const EmailRuleList = () => {
  const dispatch = useDispatch();

  const { emailRules, emailRulesLoading } = useSelector(
    (x) => x.email
  );

  const handleSelectRule = (rule) => {
    console.log('Selected rule: ', rule);
    dispatch(setSelectedEmailRule(rule));
  };

  return emailRulesLoading ? (
    <Spinner />
  ) : (
    <List>
      {emailRules.map((rule) => (
        <ListItem id={rule.rule_id} disablePadding>
          <ListItemButton onClick={() => handleSelectRule(rule)}>
            <ListItemText primary={rule.name} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export { EmailRuleList };
