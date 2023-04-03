export const COMMAND_ROUTES = {
  AI: 'Supabase AI',
  DOCS_SEARCH: 'Docs Search',
  GENERATE_SQL: 'Generate SQL',
  THEME: 'Theme',
  AI_ASK_ANYTHING: 'Ask anything',
  AI_RLS_POLICY: 'Help me create a RLS policy',
}

type QueryCategory = {
  category: string
  queries: string[]
}

type SampleQueries = QueryCategory[]

export const SAMPLE_QUERIES: SampleQueries = [
  {
    category: 'Create tables',
    queries: [
      'Create a table that stores a list of cities, and insert 10 rows of sample data into it',
      'Create tables (with foreign key relationships) for blog posts and comments',
    ],
  },
  {
    category: 'Create views',
    queries: [
      'Create a view that shows the total revenue for each customer',
      'Create a view that shows all orders that were placed in the last week',
      'Create a view that shows all products that are currently out of stock',
    ],
  },
  {
    category: 'Select data',
    queries: [
      'Retrieve a list of employees from the employees table who have a salary greater than $50,000',
      'Retrieve the department and average salary of each department from the employees table, group by department',
    ],
  },
  {
    category: 'Triggers',
    queries: [
      'Create a trigger that updates the updated_at column on the orders table with the current time when the row of the orders table is updated',
    ],
  },
  {
    category: 'Row level security',
    queries: [
      'Create an RLS policy that grants only authenticated access to the profiles table',
      'Create an RLS policy that grants SELECT access to the sales_rep role for the customers table, but denies access to all other roles',
      "Create an RLS policy that grants INSERT access access to the manager role for the employees table, but only for rows where the employee's department_id matches a list of departments that the manager is responsible for",
    ],
  },
]
